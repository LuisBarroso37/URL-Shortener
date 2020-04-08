# API Project: URL Shortener Microservice


### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":"https://url-shortener-lb.glitch.me/api/shorturl/EcriEIaDj"}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url = https://www.google.com

#### Usage:

https://url-shortener-lb.glitch.me/api/shorturl/WONEDRXJA

#### Will redirect to:

https://www.freecodecamp.org/forum/

![screencapture-url-shortener-lb-glitch-me-2020-04-08-20_55_51](https://user-images.githubusercontent.com/58770446/78822522-84246d80-79db-11ea-904e-5f0a4870ef9a.png)