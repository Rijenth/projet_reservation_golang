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

	r.With(contexts.UserContext).Get("/{userId}", userController.Get)
	r.With(contexts.UserContext).Patch("/{userId}", userController.Update)
	r.With(contexts.UserContext).Delete("/{userId}", userController.Delete)

	r.With(contexts.UserContext).Get("/{userId}/places", placeController.Index)
	r.With(contexts.UserContext).Post("/{userId}/places", placeController.Store)

	return r
}
