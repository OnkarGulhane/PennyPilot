package com.smartexpense.service;

import com.smartexpense.dto.dashboard.CategorySummaryResponse;
import com.smartexpense.dto.dashboard.DashboardSummaryResponse;
import com.smartexpense.dto.dashboard.MonthlySummaryResponse;
import com.smartexpense.entity.Budget;
import com.smartexpense.entity.User;
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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        LocalDate today = LocalDate.now();
        YearMonth currentYearMonth = YearMonth.from(today);
        LocalDate startOfMonth = currentYearMonth.atDay(1);
        LocalDate endOfMonth = currentYearMonth.atEndOfMonth();

        BigDecimal totalExpense = expenseRepository.sumTotalExpenseByUserId(userId);
        BigDecimal currentMonthExpense = expenseRepository.sumExpenseByUserIdAndDateRange(userId, startOfMonth, endOfMonth);
        BigDecimal todayExpense = expenseRepository.sumExpenseByUserIdAndDate(userId, today);
        BigDecimal highestExpense = expenseRepository.findHighestExpenseByUserId(userId);

        int dayOfMonth = today.getDayOfMonth();
        BigDecimal averageDailyExpense = currentMonthExpense.divide(
                BigDecimal.valueOf(dayOfMonth), 2, RoundingMode.HALF_UP);

        Optional<Budget> currentBudgetOpt = budgetRepository.findByUserIdAndMonthAndYear(
                userId, today.getMonthValue(), today.getYear());

        BigDecimal monthlyBudget = currentBudgetOpt.map(Budget::getAmount).orElse(BigDecimal.ZERO);
        BigDecimal remainingBudget = monthlyBudget.subtract(currentMonthExpense);
        boolean budgetExceeded = currentMonthExpense.compareTo(monthlyBudget) > 0 && monthlyBudget.compareTo(BigDecimal.ZERO) > 0;

        BigDecimal budgetUsagePercentage = BigDecimal.ZERO;
        if (monthlyBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetUsagePercentage = currentMonthExpense.divide(monthlyBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return DashboardSummaryResponse.builder()
                .totalExpense(totalExpense)
                .currentMonthExpense(currentMonthExpense)
                .todayExpense(todayExpense)
                .highestExpense(highestExpense)
                .averageDailyExpense(averageDailyExpense)
                .monthlyBudget(monthlyBudget)
                .remainingBudget(remainingBudget)
                .budgetUsagePercentage(budgetUsagePercentage)
                .budgetExceeded(budgetExceeded)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getCategorySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<ExpenseRepository.CategorySummaryProjection> projections = expenseRepository.getCategorySummaryByUserId(user.getId());

        return projections.stream()
                .map(p -> CategorySummaryResponse.builder()
                        .category(p.getCategory())
                        .total(p.getTotal())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MonthlySummaryResponse> getMonthlySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        LocalDate now = LocalDate.now();
        List<MonthlySummaryResponse> monthlySummaries = new ArrayList<>();

        // Retrieve last 6 months
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.from(now.minusMonths(i));
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal total = expenseRepository.sumExpenseByUserIdAndDateRange(userId, start, end);
            String monthLabel = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            monthlySummaries.add(MonthlySummaryResponse.builder()
                    .month(monthLabel)
                    .total(total)
                    .build());
        }

        return monthlySummaries;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
