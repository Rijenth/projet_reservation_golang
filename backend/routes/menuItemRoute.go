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
		r.Patch("/{menuItemId}", menuItemController.Update)
	})

	return r
}
