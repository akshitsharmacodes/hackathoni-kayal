"""Enable row-level security on all tables.

Supabase exposes the public schema through its Data API to anyone with the publishable key.
With RLS on and no policies, that API sees nothing; the FastAPI backend connects as the
`postgres` role, which bypasses RLS, so the app is unaffected.

Revision ID: b1c2d3e4f5a6
Revises: 90a46834ac66
"""
from alembic import op

revision = "b1c2d3e4f5a6"
down_revision = "90a46834ac66"
branch_labels = None
depends_on = None

TABLES = ["places", "reports", "status_events", "alerts", "gauge_stations", "gauge_readings", "alembic_version"]


def upgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    for t in TABLES:
        op.execute(f'ALTER TABLE "{t}" ENABLE ROW LEVEL SECURITY')


def downgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    for t in TABLES:
        op.execute(f'ALTER TABLE "{t}" DISABLE ROW LEVEL SECURITY')
