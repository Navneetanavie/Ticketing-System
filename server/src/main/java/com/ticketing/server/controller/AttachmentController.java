package com.ticketing.server.controller;

import com.ticketing.server.model.Attachment;
import com.ticketing.server.service.AttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttachmentController {

  private final AttachmentService attachmentService;

  public AttachmentController(AttachmentService attachmentService) {
    this.attachmentService = attachmentService;
  }

  @PostMapping("/tickets/{ticketId}/attachments")
  public Attachment uploadAttachment(@PathVariable Long ticketId, @RequestParam("file") MultipartFile file)
      throws IOException {
    return attachmentService.saveAttachment(ticketId, file);
  }

  @GetMapping("/tickets/{ticketId}/attachments")
  public List<Attachment> getAttachments(@PathVariable Long ticketId) {
    return attachmentService.getAttachments(ticketId);
  }

  @GetMapping("/attachments/{id}/download")
  public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) throws MalformedURLException {
    Attachment attachment = attachmentService.getAttachment(id);
    Path filePath = Paths.get(attachment.getFilePath());
    Resource resource = new UrlResource(filePath.toUri());

    if (resource.exists() || resource.isReadable()) {
      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(attachment.getFileType()))
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFilename() + "\"")
          .body(resource);
    } else {
      throw new RuntimeException("Could not read file: " + attachment.getFilename());
    }
  }
}
