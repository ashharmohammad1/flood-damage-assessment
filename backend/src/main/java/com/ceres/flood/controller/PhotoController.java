package com.ceres.flood.controller;

import com.ceres.flood.dto.PhotoDTO;
import com.ceres.flood.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping
    public ResponseEntity<PhotoDTO> uploadPhoto(
            @RequestParam Long assessmentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "capturedAt", required = false) String capturedAt) throws IOException {
        PhotoDTO photo = photoService.uploadPhoto(assessmentId, file, description, capturedAt);
        return ResponseEntity.status(HttpStatus.CREATED).body(photo);
    }

    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByAssessment(@PathVariable Long assessmentId) {
        List<PhotoDTO> photos = photoService.getPhotosByAssessment(assessmentId);
        return ResponseEntity.ok(photos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) throws IOException {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}
