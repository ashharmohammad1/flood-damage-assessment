package com.ceres.flood.controller;

import com.ceres.flood.dto.FarmAssessmentDTO;
import com.ceres.flood.service.FarmAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class FarmAssessmentController {

    private final FarmAssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<FarmAssessmentDTO> createAssessment(@RequestBody FarmAssessmentDTO dto) {
        FarmAssessmentDTO created = assessmentService.createAssessment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmAssessmentDTO> getAssessment(@PathVariable Long id) {
        FarmAssessmentDTO assessment = assessmentService.getAssessment(id);
        return ResponseEntity.ok(assessment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmAssessmentDTO> updateAssessment(
            @PathVariable Long id,
            @RequestBody FarmAssessmentDTO dto) {
        FarmAssessmentDTO updated = assessmentService.updateAssessment(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<FarmAssessmentDTO>> getAllAssessments() {
        List<FarmAssessmentDTO> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/assessor/{assessor}")
    public ResponseEntity<List<FarmAssessmentDTO>> getAssessmentsByAssessor(@PathVariable String assessor) {
        List<FarmAssessmentDTO> assessments = assessmentService.getAssessmentsByAssessor(assessor);
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/unsynced")
    public ResponseEntity<List<FarmAssessmentDTO>> getUnSyncedAssessments() {
        List<FarmAssessmentDTO> assessments = assessmentService.getUnSyncedAssessments();
        return ResponseEntity.ok(assessments);
    }

    @PutMapping("/{id}/sync")
    public ResponseEntity<Void> markAsSynced(@PathVariable Long id) {
        assessmentService.markAsSynced(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }
}
