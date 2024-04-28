require 'sidekiq'
require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq.strict_args!(false)

Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq::Web.use(Rack::Auth::Basic) do |user, password|
  [user, password] == [ENV.fetch('SIDEKIQ_WEB_USERNAME'), ENV.fetch('SIDEKIQ_WEB_PASSWORD')]
end

if Sidekiq.server?
  cron_schedule_file = "config/schedule.yml"

  Sidekiq::Cron::Job.load_from_hash(YAML.load_file(cron_schedule_file))
end