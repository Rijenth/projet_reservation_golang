package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func PlaceRoutes() chi.Router {
	r := chi.NewRouter()

	placeController := controllers.PlaceController{}

	r.With(contexts.PlaceContext).Get("/{placeId}", placeController.Get)

	return r
}
