package com.smartexpense.controller;

import com.smartexpense.dto.expense.ExpenseRequest;
import com.smartexpense.dto.expense.ExpenseResponse;
import com.smartexpense.enums.ExpenseCategory;
import com.smartexpense.enums.PaymentMethod;
import com.smartexpense.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Personal expense CRUD and filter endpoints")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseResponse> createExpense(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.createExpense(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated, sorted, and filtered expenses for authenticated user")
    public ResponseEntity<Page<ExpenseResponse>> getExpenses(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseDate,desc") String sort,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount
    ) {
        Page<ExpenseResponse> response = expenseService.getExpenses(
                userDetails.getUsername(), page, size, sort, category, paymentMethod, startDate, endDate, minAmount, maxAmount
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        ExpenseResponse response = expenseService.getExpenseById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.updateExpense(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense by ID")
    public ResponseEntity<Void> deleteExpense(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        expenseService.deleteExpense(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
