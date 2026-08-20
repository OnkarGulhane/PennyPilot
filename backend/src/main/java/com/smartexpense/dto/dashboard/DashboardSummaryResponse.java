package com.smartexpense.dto.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private BigDecimal totalExpense;
    private BigDecimal currentMonthExpense;
    private BigDecimal todayExpense;
    private BigDecimal highestExpense;
    private BigDecimal averageDailyExpense;
    private BigDecimal monthlyBudget;
    private BigDecimal remainingBudget;
    private BigDecimal budgetUsagePercentage;
    private boolean budgetExceeded;
}
