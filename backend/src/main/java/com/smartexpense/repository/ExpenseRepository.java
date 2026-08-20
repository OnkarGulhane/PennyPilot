package com.smartexpense.repository;

import com.smartexpense.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    Page<Expense> findByUserId(Long userId, Pageable pageable);

    void deleteByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumTotalExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate = :date")
    BigDecimal sumExpenseByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(MAX(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal findHighestExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT e.category AS category, COALESCE(SUM(e.amount), 0) AS total FROM Expense e WHERE e.user.id = :userId GROUP BY e.category")
    List<CategorySummaryProjection> getCategorySummaryByUserId(@Param("userId") Long userId);

    interface CategorySummaryProjection {
        String getCategory();
        BigDecimal getTotal();
    }
}
