# backend1/routes/__init__.py

"""
Routes package initialization
Imports all route modules for easier access
"""

# Import individual route modules
try:
    from . import admin
    from . import agriculture
    from . import environment
    from . import healthcare
    from . import auth
except ModuleNotFoundError as e:
    raise ModuleNotFoundError(
        f"Cannot import route module: {e}. Make sure the .py files exist in 'routes/'"
    )

# Optional: define __all__ for easier imports
__all__ = [
    "admin",
    "agriculture",
    "environment",
    "healthcare",
    "auth"
]
