package com.ceres.flood.dto;

import com.ceres.flood.model.FarmAssessment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmAssessmentDTO {
    private Long id;
    private String address;
    private Double latitude;
    private Double longitude;
    private String conditionStatus;
    private Integer totalChickens;
    private String notes;
    private String assessor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean synced;
    private List<PhotoDTO> photos;

    public static FarmAssessmentDTO fromEntity(FarmAssessment assessment) {
        return FarmAssessmentDTO.builder()
                .id(assessment.getId())
                .address(assessment.getAddress())
                .latitude(assessment.getLatitude())
                .longitude(assessment.getLongitude())
                .conditionStatus(assessment.getConditionStatus().getDisplayName())
                .totalChickens(assessment.getTotalChickens())
                .notes(assessment.getNotes())
                .assessor(assessment.getAssessor())
                .createdAt(assessment.getCreatedAt())
                .updatedAt(assessment.getUpdatedAt())
                .synced(assessment.getSynced())
                .build();
    }
}
