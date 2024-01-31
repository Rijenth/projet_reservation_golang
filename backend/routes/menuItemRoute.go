package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func MenuItemRoutes() chi.Router {
	r := chi.NewRouter()

	menuItemController := controllers.MenuItemController{}

	r.With(contexts.MenuItemContext).Group(func(r chi.Router) {
		r.Get("/", menuItemController.Index)

		r.Get("/{menuItemId}", menuItemController.Get)
		r.Patch("/{menuItemId}", menuItemController.Update)
		r.Delete("/{menuItemId}", menuItemController.Delete)
	})

	return r
}