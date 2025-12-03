package com.ticketing.server.controller;

import com.ticketing.server.model.Ticket;
import com.ticketing.server.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<Ticket> getAllTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) com.ticketing.server.model.TicketStatus status,
            @RequestParam(required = false) com.ticketing.server.model.Priority priority) {
        return ticketService.getAllTickets(search, status, priority);
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return ticketService.getTicket(id);
    }

    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ticketService.updateTicket(id, ticket);
    }

    @PostMapping("/{id}/rate")
    public Ticket rateTicket(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        Integer rating = (Integer) payload.get("rating");
        String feedback = (String) payload.get("feedback");
        return ticketService.rateTicket(id, rating, feedback);
    }
}
