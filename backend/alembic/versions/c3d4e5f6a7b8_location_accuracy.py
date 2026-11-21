"""Store GPS accuracy and location source on reports (D56).

Revision ID: c3d4e5f6a7b8
Revises: b1c2d3e4f5a6
"""
import sqlalchemy as sa
from alembic import op

revision = "c3d4e5f6a7b8"
down_revision = "b1c2d3e4f5a6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("reports") as batch:
        batch.add_column(sa.Column("location_accuracy_m", sa.Float(), nullable=True))
        batch.add_column(sa.Column("location_source", sa.String(length=10), nullable=False, server_default="gps"))


def downgrade() -> None:
    with op.batch_alter_table("reports") as batch:
        batch.drop_column("location_source")
        batch.drop_column("location_accuracy_m")
