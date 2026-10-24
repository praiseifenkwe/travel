"""Copy the local Chroma collection into the configured Qdrant collection."""

from app.services.rag_service import migrate_chroma_to_qdrant


def main() -> None:
    result = migrate_chroma_to_qdrant()
    print(
        "Migration complete: "
        f"{result['points_migrated']} points copied from "
        f"'{result['source_collection']}' to '{result['target_collection']}'."
    )


if __name__ == "__main__":
    main()
