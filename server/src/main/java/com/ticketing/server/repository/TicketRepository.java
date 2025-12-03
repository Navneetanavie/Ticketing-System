package com.ticketing.server.repository;

import com.ticketing.server.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedById(Long userId);

    List<Ticket> findByAssignedToId(Long userId);

    List<Ticket> findBySubjectContainingIgnoreCase(String subject);

    List<Ticket> findByStatus(com.ticketing.server.model.TicketStatus status);

    List<Ticket> findByPriority(com.ticketing.server.model.Priority priority);
}
