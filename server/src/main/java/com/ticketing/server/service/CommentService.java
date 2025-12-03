package com.ticketing.server.service;

import com.ticketing.server.model.Comment;
import com.ticketing.server.model.Ticket;
import com.ticketing.server.model.User;
import com.ticketing.server.repository.CommentRepository;
import com.ticketing.server.repository.TicketRepository;
import com.ticketing.server.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

  private final CommentRepository commentRepository;
  private final TicketRepository ticketRepository;
  private final UserRepository userRepository;

  public CommentService(CommentRepository commentRepository, TicketRepository ticketRepository,
      UserRepository userRepository) {
    this.commentRepository = commentRepository;
    this.ticketRepository = ticketRepository;
    this.userRepository = userRepository;
  }

  private User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  public Comment addComment(Long ticketId, String text) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new RuntimeException("Ticket not found"));
    User user = getCurrentUser();

    Comment comment = new Comment();
    comment.setText(text);
    comment.setTicket(ticket);
    comment.setAuthor(user);
    comment.setTimestamp(LocalDateTime.now());

    return commentRepository.save(comment);
  }

  public List<Comment> getComments(Long ticketId) {
    // Assuming we can just fetch from the ticket's list or repo
    // But since we have a bidirectional relationship, we can also just return
    // ticket.getComments()
    // However, fetching fresh might be better.
    // Let's add a method to CommentRepository to find by ticket id if needed,
    // or just rely on the ticket entity if it's eagerly fetched or transaction is
    // open.
    // For simplicity, let's rely on the ticket entity for now, or add a method to
    // repo.
    // Actually, let's add findByTicketId to CommentRepository for cleaner
    // separation.
    return commentRepository.findByTicketId(ticketId);
  }
}
