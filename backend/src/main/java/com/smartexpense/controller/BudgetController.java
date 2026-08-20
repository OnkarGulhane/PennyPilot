package com.smartexpense.controller;

import com.smartexpense.dto.budget.BudgetRequest;
import com.smartexpense.dto.budget.BudgetResponse;
import com.smartexpense.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@Tag(name = "Budgets", description = "Monthly budget management endpoints")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @Operation(summary = "Create a monthly budget")
    public ResponseEntity<BudgetResponse> createBudget(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BudgetRequest request
    ) {
        BudgetResponse response = budgetService.createBudget(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all monthly budgets for authenticated user")
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<BudgetResponse> response = budgetService.getBudgets(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<BudgetResponse> getBudgetById(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BudgetResponse response = budgetService.getBudgetById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget by ID")
    public ResponseEntity<BudgetResponse> updateBudget(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request
    ) {
        BudgetResponse response = budgetService.updateBudget(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget by ID")
    public ResponseEntity<Void> deleteBudget(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        budgetService.deleteBudget(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
