package com.ceres.flood.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "farm_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionStatus conditionStatus;

    @Column(nullable = false)
    private Integer totalChickens;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private String assessor;
    
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(name = "synced")
    private Boolean synced = false;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "assessment")
    private List<Photo> photos;

    public enum ConditionStatus {
        GOOD("Good"),
        MODERATE("Moderate"),
        BAD("Bad");

        private final String displayName;

        ConditionStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        synced = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
