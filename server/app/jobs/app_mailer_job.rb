class AppMailerJob < ApplicationJob
  queue_as :default

  attr_accessor :sendgrid_service

  def perform(personalizations, template_id)
    @sendgrid_service = SendgridService.new(personalizations: personalizations, template_id: template_id)
    sendgrid_service.send_email rescue nil
  end
end
