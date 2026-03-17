package com.ceres.flood.repository;

import com.ceres.flood.model.FarmAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FarmAssessmentRepository extends JpaRepository<FarmAssessment, Long> {
    List<FarmAssessment> findByAssessor(String assessor);
    List<FarmAssessment> findBySynced(Boolean synced);
    
    @Query("SELECT f FROM FarmAssessment f WHERE f.synced = false")
    List<FarmAssessment> findUnSyncedAssessments();
}
