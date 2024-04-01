require 'uri'
require 'net/http'

module RequestHelper
  module_function

  def http_get_request(url, query_params: {})
    uri = URI.parse(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true

    request_uri = uri.request_uri
    request_uri += "?#{query_params.to_query}" if query_params.present?

    req = Net::HTTP::Get.new(request_uri)

    response = https.request(req)
    return false unless response.is_a?(Net::HTTPSuccess)

    response.body
  end

  def http_post_request(url, body: {})
    uri = URI.parse(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true

    req = Net::HTTP::Post.new(uri.request_uri, 'Content-Type' => 'application/json')
    req.body = body.to_json

    response = https.request(req)
    return false unless response.is_a?(Net::HTTPSuccess)

    response.body
  end
end
