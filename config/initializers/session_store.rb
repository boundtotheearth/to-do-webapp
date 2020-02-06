if Rails.env === 'production'
  Rails.application.config.session_store :cookie_store, key: '_farrell-to-do-webapp', domain: 'http://farrell-to-do-webapp.herokuapp.com'
else
  Rails.application.config.session_store :cookie_store, key: '_farrell-to-do-webapp'
end
