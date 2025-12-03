package com.ticketing.server.service;

import com.ticketing.server.model.Attachment;
import com.ticketing.server.model.Ticket;
import com.ticketing.server.model.User;
import com.ticketing.server.repository.AttachmentRepository;
import com.ticketing.server.repository.TicketRepository;
import com.ticketing.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

  @Value("${file.upload-dir:uploads}")
  private String uploadDir;

  private final AttachmentRepository attachmentRepository;
  private final TicketRepository ticketRepository;
  private final UserRepository userRepository;

  public AttachmentService(AttachmentRepository attachmentRepository, TicketRepository ticketRepository,
      UserRepository userRepository) {
    this.attachmentRepository = attachmentRepository;
    this.ticketRepository = ticketRepository;
    this.userRepository = userRepository;

    // Ensure upload directory exists
    new File("uploads").mkdirs();
  }

  private User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  public Attachment saveAttachment(Long ticketId, MultipartFile file) throws IOException {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new RuntimeException("Ticket not found"));
    User user = getCurrentUser();

    // Ensure directory exists (using absolute path for safety in Docker)
    Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    Files.createDirectories(uploadPath);

    // Generate unique filename
    String originalFilename = file.getOriginalFilename();
    String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
    Path targetLocation = uploadPath.resolve(storedFilename);

    // Save file
    Files.copy(file.getInputStream(), targetLocation);

    // Save entity
    Attachment attachment = new Attachment();
    attachment.setFilename(originalFilename);
    attachment.setFileType(file.getContentType());
    attachment.setFilePath(targetLocation.toString());
    attachment.setTicket(ticket);
    attachment.setUploader(user);

    return attachmentRepository.save(attachment);
  }

  public List<Attachment> getAttachments(Long ticketId) {
    return attachmentRepository.findByTicketId(ticketId);
  }

  public Attachment getAttachment(Long id) {
    return attachmentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Attachment not found"));
  }
}
