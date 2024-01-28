package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func UserRoutes() chi.Router {
	r := chi.NewRouter()

	userController := controllers.UserController{}
	placeController := controllers.PlaceController{}

	r.Get("/", userController.Index)

	r.With(contexts.UserContext).Group(func(r chi.Router) {
		r.Get("/{userId}", userController.Get)
		r.Patch("/{userId}", userController.Update)
		r.Delete("/{userId}", userController.Delete)

		r.Get("/{userId}/places", placeController.Index)
		r.Post("/{userId}/places", placeController.Store)
	})

	return r
}
