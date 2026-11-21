"""Alembic env: uses the app's own engine and models, so DATABASE_URL in .env is the single source."""
from logging.config import fileConfig

from alembic import context

from app import models  # noqa: F401  (registers all tables on Base.metadata)
from app.config import settings
from app.db import Base, engine

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
is_sqlite = settings.database_url.startswith("sqlite")


def run_migrations_offline() -> None:
    context.configure(url=settings.database_url, target_metadata=target_metadata,
                      literal_binds=True, dialect_opts={"paramstyle": "named"})
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata,
                          render_as_batch=is_sqlite)  # SQLite needs batch mode for ALTERs
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
