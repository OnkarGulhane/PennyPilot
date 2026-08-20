package com.smartexpense.service;

import com.smartexpense.dto.expense.ExpenseRequest;
import com.smartexpense.dto.expense.ExpenseResponse;
import com.smartexpense.entity.Expense;
import com.smartexpense.entity.User;
import com.smartexpense.enums.ExpenseCategory;
import com.smartexpense.enums.PaymentMethod;
import com.smartexpense.exception.ResourceNotFoundException;
import com.smartexpense.repository.ExpenseRepository;
import com.smartexpense.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExpenseResponse createExpense(String userEmail, ExpenseRequest request) {
        User user = getUserByEmail(userEmail);

        Expense expense = Expense.builder()
                .user(user)
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate())
                .paymentMethod(request.getPaymentMethod())
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getExpenses(
            String userEmail,
            int page,
            int size,
            String sort,
            ExpenseCategory category,
            PaymentMethod paymentMethod,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal minAmount,
            BigDecimal maxAmount
    ) {
        User user = getUserByEmail(userEmail);

        // Sorting configuration
        Sort sortOrder = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        // Dynamic JPA Specification for filtering
        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // mandatory user isolation
            predicates.add(cb.equal(root.get("user").get("id"), user.getId()));

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (paymentMethod != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), endDate));
            }
            if (minAmount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }
            if (maxAmount != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);
        return expensePage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(String userEmail, Long id, ExpenseRequest request) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    @Transactional
    public void deleteExpense(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        expenseRepository.delete(expense);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .expenseDate(expense.getExpenseDate())
                .paymentMethod(expense.getPaymentMethod())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "expenseDate");
        }
        String[] parts = sortParam.split(",");
        String property = parts[0].trim();
        Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, property);
    }
}
