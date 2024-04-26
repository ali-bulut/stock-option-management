require 'sidekiq'
require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq::Web.use(Rack::Auth::Basic) do |user, password|
  [user, password] == [ENV.fetch('SIDEKIQ_WEB_USERNAME'), ENV.fetch('SIDEKIQ_WEB_PASSWORD')]
end

# ======================================================= Sidekiq Crons ================================================

if Sidekiq.server?
  utc_file = "config/schedule.yml"

  def _cron_set_to_timezone(data, timezone = 'UTC')
    data.each { |_, properties| properties['cron'] = "#{properties['cron']} #{timezone}" }
  end

  def _cron_parse_crons(data)
    data.each { |_, properties| properties['cron'] = Fugit.parse(properties['cron']).original }
  end

  def _cron_load_schedule_file(path)
    data = YAML.load_file(path) || {}
    _cron_parse_crons(data)
    data
  end

  schedules = _cron_load_schedule_file(utc_file)
  schedules = _cron_set_to_timezone(schedules, 'UTC')

  Sidekiq::Cron::Job.load_from_hash!(schedules || {})
end