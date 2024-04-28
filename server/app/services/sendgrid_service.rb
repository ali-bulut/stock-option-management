require 'sendgrid-ruby'

class SendgridService
  include SendGrid

  PERSONALIZATION_EMAIL_COLUMNS = %i[to bcc cc]

  attr_accessor :personalizations, :template_id
  attr_accessor :mail_object

  def initialize(personalizations: nil, template_id: nil)
    self.personalizations = personalizations
    self.template_id = template_id
  end

  def send_email
    prepare_mail_object&.prepare_personalizations&.send
  end

  def prepare_mail_object
    mail = SendGrid::Mail.new
    mail.from = Email.new(email: "ali@alibulut.net", name: "Stock MNG")
    mail.template_id = self.template_id

    self.mail_object = mail
    self
  end

  def prepare_personalizations
    return if self.mail_object.nil?
    return if self.personalizations.nil?

    emails = []
    self.personalizations.each do |personalization_hash|
      personalization = Personalization.new

      PERSONALIZATION_EMAIL_COLUMNS.each do |column|
        flatten_emails(personalization_hash[column]).each do |email_address|
          personalization_email = email_address
          unless emails.include?(personalization_email)
            personalization.send("add_#{column}", Email.new(email: personalization_email))
            emails << personalization_email
          end
        end
      end

      personalization_hash = personalization_hash.with_indifferent_access
      personalization.add_dynamic_template_data(personalization_hash['subs'])
      self.mail_object.add_personalization(personalization)
    end

    return if self.mail_object.personalizations.blank?

    self
  end

  def send
    return if self.mail_object.nil?

    send_grid = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    begin
      response send_grid.client.mail._("send").post(request_body: self.mail_object.to_json)
      puts response
      true
    rescue StandardError => exception
      Rails.logger.error("Error in SendgridService: #{exception.message}")
      raise exception
    end
  end

  private

  def flatten_emails(list)
    case list
    when Array
      result = list
    when String
      result = list.split(',')
    else
      result = []
    end
    result.map(&:strip).select(&:present?)
  end
end