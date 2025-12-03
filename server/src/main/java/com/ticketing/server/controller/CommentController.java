package com.ticketing.server.controller;

import com.ticketing.server.model.Comment;
import com.ticketing.server.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class CommentController {

  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @GetMapping
  public List<Comment> getComments(@PathVariable Long ticketId) {
    return commentService.getComments(ticketId);
  }

  @PostMapping
  public Comment addComment(@PathVariable Long ticketId, @RequestBody Map<String, String> payload) {
    return commentService.addComment(ticketId, payload.get("text"));
  }
}
