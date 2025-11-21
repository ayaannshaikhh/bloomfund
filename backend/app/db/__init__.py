"""
package initializer for the db layer
"""

from .supabase_client import supabase
from .models import (
    get_all_scholarships,
    add_a_scholarship,
    get_scholarship_by_id,
    save_a_scholarship,
    get_user_favourites,
    remove_favourite
)

__all__ = [
    "supabase",
    "get_all_scholarships",
    "add_a_scholarship",
    "get_scholarship_by_id",
    "save_a_scholarship",
    "get_user_favourites",
    "remove_favourite",
]

