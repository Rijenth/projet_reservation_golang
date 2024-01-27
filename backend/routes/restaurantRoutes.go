package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func RestaurantRoutes() chi.Router {
	r := chi.NewRouter()

	restaurantController := controllers.RestaurantController{}
	menuController := controllers.MenuController{}

	r.With(contexts.RestaurantContext).Get("/{restaurantId}", restaurantController.Get)
	r.With(contexts.RestaurantContext).Delete("/{restaurantId}", restaurantController.Delete)
	r.With(contexts.RestaurantContext).Patch("/{restaurantId}", restaurantController.Update)

	r.With(contexts.RestaurantContext).Get("/{restaurantId}/menus", menuController.Index)
	r.With(contexts.RestaurantContext).Post("/{restaurantId}/menus", menuController.Store)

	return r
}
