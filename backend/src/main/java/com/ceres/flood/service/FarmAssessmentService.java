package com.ceres.flood.service;

import com.ceres.flood.dto.FarmAssessmentDTO;
import com.ceres.flood.model.FarmAssessment;
import com.ceres.flood.repository.FarmAssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmAssessmentService {

    private final FarmAssessmentRepository assessmentRepository;

    public FarmAssessmentDTO createAssessment(FarmAssessmentDTO dto) {
        FarmAssessment assessment = FarmAssessment.builder()
                .id(dto.getId())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .conditionStatus(FarmAssessment.ConditionStatus.valueOf(dto.getConditionStatus()))
                .totalChickens(dto.getTotalChickens())
                .notes(dto.getNotes())
                .assessor(dto.getAssessor())
                .synced(false)
                .build();

        FarmAssessment saved = assessmentRepository.save(assessment);
        return FarmAssessmentDTO.fromEntity(saved);
    }

    public FarmAssessmentDTO updateAssessment(Long id, FarmAssessmentDTO dto) {
        FarmAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        assessment.setAddress(dto.getAddress());
        assessment.setLatitude(dto.getLatitude());
        assessment.setLongitude(dto.getLongitude());
        assessment.setConditionStatus(FarmAssessment.ConditionStatus.valueOf(dto.getConditionStatus()));
        assessment.setTotalChickens(dto.getTotalChickens());
        assessment.setNotes(dto.getNotes());
        assessment.setSynced(false);

        FarmAssessment updated = assessmentRepository.save(assessment);
        return FarmAssessmentDTO.fromEntity(updated);
    }

    public FarmAssessmentDTO getAssessment(Long id) {
        FarmAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        return FarmAssessmentDTO.fromEntity(assessment);
    }

    public List<FarmAssessmentDTO> getAllAssessments() {
        return assessmentRepository.findAll().stream()
                .map(FarmAssessmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FarmAssessmentDTO> getAssessmentsByAssessor(String assessor) {
        return assessmentRepository.findByAssessor(assessor).stream()
                .map(FarmAssessmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FarmAssessmentDTO> getUnSyncedAssessments() {
        return assessmentRepository.findUnSyncedAssessments().stream()
                .map(FarmAssessmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public void markAsSynced(Long id) {
        FarmAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        assessment.setSynced(true);
        assessmentRepository.save(assessment);
    }

    public void deleteAssessment(Long id) {
        assessmentRepository.deleteById(id);
    }
}
