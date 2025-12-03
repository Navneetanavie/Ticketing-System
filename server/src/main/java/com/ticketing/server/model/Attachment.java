package com.ticketing.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String filename;

  @Column(nullable = false)
  private String fileType;

  @Column(nullable = false)
  private String filePath; // Path on disk

  @ManyToOne
  @JoinColumn(name = "ticket_id", nullable = false)
  @com.fasterxml.jackson.annotation.JsonIgnore
  private Ticket ticket;

  @ManyToOne
  @JoinColumn(name = "uploader_id", nullable = false)
  private User uploader;

  private LocalDateTime uploadedAt = LocalDateTime.now();
}
