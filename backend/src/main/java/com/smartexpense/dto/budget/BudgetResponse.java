package com.smartexpense.dto.budget;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponse {

    private Long id;
    private Integer month;
    private Integer year;
    private BigDecimal amount;
    private BigDecimal totalSpent;
    private BigDecimal remainingAmount;
    private BigDecimal usagePercentage;
    private boolean budgetExceeded;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
