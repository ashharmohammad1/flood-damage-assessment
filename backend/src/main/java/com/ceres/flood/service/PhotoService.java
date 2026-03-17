package com.ceres.flood.service;

import com.ceres.flood.dto.PhotoDTO;
import com.ceres.flood.model.FarmAssessment;
import com.ceres.flood.model.Photo;
import com.ceres.flood.repository.FarmAssessmentRepository;
import com.ceres.flood.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    private final PhotoRepository photoRepository;
    private final FarmAssessmentRepository assessmentRepository;

    public PhotoDTO uploadPhoto(Long assessmentId, MultipartFile file, String description, String capturedAt) throws IOException {
        FarmAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        // Create upload directory if it doesn't exist
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        // Generate unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = Paths.get(uploadDir, fileName).toString();

        // Save file
        Files.copy(file.getInputStream(), Paths.get(filePath));

        // Create Photo entity
        Photo photo = Photo.builder()
                .assessment(assessment)
                .fileName(fileName)
                .filePath(filePath)
                .contentType(file.getContentType())
                .description(description)
                .capturedAt(capturedAt)
                .build();

        Photo savedPhoto = photoRepository.save(photo);

        // Mark assessment as not synced
        assessment.setSynced(false);
        assessmentRepository.save(assessment);

        return convertToDTO(savedPhoto);
    }

    public List<PhotoDTO> getPhotosByAssessment(Long assessmentId) {
        return photoRepository.findByAssessmentId(assessmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deletePhoto(Long photoId) throws IOException {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // Delete file
        Files.deleteIfExists(Paths.get(photo.getFilePath()));

        // Mark assessment as not synced
        FarmAssessment assessment = photo.getAssessment();
        assessment.setSynced(false);
        assessmentRepository.save(assessment);

        // Delete photo record
        photoRepository.deleteById(photoId);
    }

    private PhotoDTO convertToDTO(Photo photo) {
        return PhotoDTO.builder()
                .id(photo.getId())
                .fileName(photo.getFileName())
                .filePath(photo.getFilePath())
                .contentType(photo.getContentType())
                .description(photo.getDescription())
                .capturedAt(photo.getCapturedAt())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
