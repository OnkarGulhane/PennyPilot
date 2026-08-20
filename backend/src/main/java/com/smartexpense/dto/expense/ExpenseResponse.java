package com.smartexpense.dto.expense;

import com.smartexpense.enums.ExpenseCategory;
import com.smartexpense.enums.PaymentMethod;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;
    private BigDecimal amount;
    private ExpenseCategory category;
    private String description;
    private LocalDate expenseDate;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
