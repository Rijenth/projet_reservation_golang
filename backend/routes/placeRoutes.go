package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func PlaceRoutes() chi.Router {
	r := chi.NewRouter()

	placeController := controllers.PlaceController{}
	restaurantController := controllers.RestaurantController{}

	r.With(contexts.PlaceContext).Group(func(r chi.Router) {
		r.Get("/{placeId}", placeController.Get)

		r.Get("/{placeId}/restaurants", restaurantController.Index)
		r.Post("/{placeId}/restaurants", restaurantController.Store)
	})

	return r
}
