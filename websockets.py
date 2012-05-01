import os.path
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

class FaviconHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect('/static/favicon.ico')

class WebHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("websockets.html")

class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
    	print 'new connection'
    	self.write_message("Hi, client: connection is made ...")
      
    def on_message(self, message):
    	print 'message received: \"%s\"' % message
    	self.write_message("Echo: \"" + message + "\"")

    def on_close(self):
      print 'connection closed'

handlers = [
    (r"/favicon.ico", FaviconHandler),
    (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static'}),
    (r'/', WebHandler),
    (r'/ws', WSHandler),
]

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "static"),
)

application = tornado.web.Application(handlers, **settings)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
