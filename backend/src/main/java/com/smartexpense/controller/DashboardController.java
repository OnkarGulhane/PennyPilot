package com.smartexpense.controller;

import com.smartexpense.dto.dashboard.CategorySummaryResponse;
import com.smartexpense.dto.dashboard.DashboardSummaryResponse;
import com.smartexpense.dto.dashboard.MonthlySummaryResponse;
import com.smartexpense.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard summary and financial analytics endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get overall dashboard summary metrics")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        DashboardSummaryResponse response = dashboardService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-summary")
    @Operation(summary = "Get spending summary grouped by category")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<CategorySummaryResponse> response = dashboardService.getCategorySummary(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly-summary")
    @Operation(summary = "Get monthly spending trend for the past 6 months")
    public ResponseEntity<List<MonthlySummaryResponse>> getMonthlySummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<MonthlySummaryResponse> response = dashboardService.getMonthlySummary(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
