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
	commandController := controllers.CommandController{}

	r.With(contexts.RestaurantContext).Group(func(r chi.Router) {
		r.Get("/{restaurantId}", restaurantController.Get)
		r.Delete("/{restaurantId}", restaurantController.Delete)
		r.Patch("/{restaurantId}", restaurantController.Update)

		r.Get("/{restaurantId}/menus", menuController.Index)
		r.Post("/{restaurantId}/menus", menuController.Store)

		r.Get("/{restaurantId}/commands", commandController.Index)
		r.Post("/{restaurantId}/commands", commandController.Store)
	})

	return r
}
