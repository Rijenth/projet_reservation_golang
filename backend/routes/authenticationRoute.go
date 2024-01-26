package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func AuthenticationRoutes() chi.Router {
	r := chi.NewRouter()

	authenticationController := controllers.AuthenticationController{}
	userController := controllers.UserController{}

	r.Post("/register", userController.Store)

	r.Post("/login", authenticationController.Login)

	r.With(contexts.UserContext).Get("/me", authenticationController.CurrentUser)

	return r
}
