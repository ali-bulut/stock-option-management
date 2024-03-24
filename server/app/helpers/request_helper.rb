require 'uri'
require 'net/http'

module RequestHelper
  module_function

  def http_post_request(url, body: {})
    uri = URI.parse(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = false # TODO: change to true once we have a valid SSL certificate

    req = Net::HTTP::Post.new(uri.request_uri, 'Content-Type' => 'application/json')
    req.body = body.to_json

    response = https.request(req)
    return false unless response.is_a?(Net::HTTPSuccess)

    response.body
  end
end
