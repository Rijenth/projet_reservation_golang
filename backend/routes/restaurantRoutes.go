package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func RestaurantRoutes() chi.Router {
	r := chi.NewRouter()

	restaurantController := controllers.RestaurantController{}

	r.With(contexts.RestaurantContext).Get("/{restaurantId}", restaurantController.Get)
	r.With(contexts.RestaurantContext).Delete("/{restaurantId}", restaurantController.Delete)
	r.With(contexts.RestaurantContext).Patch("/{restaurantId}", restaurantController.Update)

	return r
}
