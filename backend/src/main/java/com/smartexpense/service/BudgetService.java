package com.smartexpense.service;

import com.smartexpense.dto.budget.BudgetRequest;
import com.smartexpense.dto.budget.BudgetResponse;
import com.smartexpense.entity.Budget;
import com.smartexpense.entity.User;
import com.smartexpense.exception.DuplicateResourceException;
import com.smartexpense.exception.ResourceNotFoundException;
import com.smartexpense.repository.BudgetRepository;
import com.smartexpense.repository.ExpenseRepository;
import com.smartexpense.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public BudgetResponse createBudget(String userEmail, BudgetRequest request) {
        User user = getUserByEmail(userEmail);

        if (budgetRepository.existsByUserIdAndMonthAndYear(user.getId(), request.getMonth(), request.getYear())) {
            throw new DuplicateResourceException("Budget already exists for month " + request.getMonth() + " and year " + request.getYear());
        }

        Budget budget = Budget.builder()
                .user(user)
                .month(request.getMonth())
                .year(request.getYear())
                .amount(request.getAmount())
                .build();

        Budget savedBudget = budgetRepository.save(budget);
        return calculateAndMapResponse(savedBudget, user.getId());
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Budget> budgets = budgetRepository.findByUserId(user.getId());
        return budgets.stream()
                .map(budget -> calculateAndMapResponse(budget, user.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        return calculateAndMapResponse(budget, user.getId());
    }

    @Transactional
    public BudgetResponse updateBudget(String userEmail, Long id, BudgetRequest request) {
        User user = getUserByEmail(userEmail);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        budget.setAmount(request.getAmount());
        Budget updatedBudget = budgetRepository.save(budget);
        return calculateAndMapResponse(updatedBudget, user.getId());
    }

    @Transactional
    public void deleteBudget(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        budgetRepository.delete(budget);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public BudgetResponse calculateAndMapResponse(Budget budget, Long userId) {
        YearMonth yearMonth = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalSpent = expenseRepository.sumExpenseByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal budgetAmount = budget.getAmount();

        BigDecimal remainingAmount = budgetAmount.subtract(totalSpent);
        boolean budgetExceeded = totalSpent.compareTo(budgetAmount) > 0;

        BigDecimal usagePercentage = BigDecimal.ZERO;
        if (budgetAmount.compareTo(BigDecimal.ZERO) > 0) {
            usagePercentage = totalSpent.divide(budgetAmount, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .month(budget.getMonth())
                .year(budget.getYear())
                .amount(budget.getAmount())
                .totalSpent(totalSpent)
                .remainingAmount(remainingAmount)
                .usagePercentage(usagePercentage)
                .budgetExceeded(budgetExceeded)
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}
