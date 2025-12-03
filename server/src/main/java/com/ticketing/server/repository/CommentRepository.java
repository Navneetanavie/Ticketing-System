package com.ticketing.server.repository;

import com.ticketing.server.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  java.util.List<Comment> findByTicketId(Long ticketId);
}
