package com.ticketing.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

  public void sendEmail(String to, String subject, String body) {
    // In a real app, use JavaMailSender here.
    // For this demo, we just log it.
    logger.info("==================================================");
    logger.info("SENDING EMAIL");
    logger.info("To: {}", to);
    logger.info("Subject: {}", subject);
    logger.info("Body: {}", body);
    logger.info("==================================================");
  }
}
