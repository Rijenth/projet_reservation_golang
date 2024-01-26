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

	r.With(contexts.PlaceContext).Get("/{placeId}", placeController.Get)

	r.With(contexts.PlaceContext).Get("/{placeId}/restaurants", restaurantController.Index)
	r.With(contexts.PlaceContext).Post("/{placeId}/restaurants", restaurantController.Store)

	return r
}
