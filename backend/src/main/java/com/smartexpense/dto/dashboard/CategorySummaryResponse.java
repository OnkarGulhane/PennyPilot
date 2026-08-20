package com.smartexpense.dto.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorySummaryResponse {

    private String category;
    private BigDecimal total;
}
