package com.ceres.flood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoDTO {
    private Long id;
    private String fileName;
    private String filePath;
    private String contentType;
    private String capturedAt;
    private String description;
    private LocalDateTime createdAt;
}
