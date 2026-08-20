package com.smartexpense.dto.dashboard;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlySummaryResponse {

    private String month;
    private BigDecimal total;
}
